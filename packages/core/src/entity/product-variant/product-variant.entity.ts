import { CurrencyCode, GlobalFlag } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { roundMoney } from '../../common/round-money';
import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { LocaleString, Translatable, Translation } from '../../common/types/locale-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { Asset } from '../asset/asset.entity';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomProductVariantFields } from '../custom-entity-fields';
import { EntityId } from '../entity-id.decorator';
import { Product } from '../product/product.entity';
import { ProductOption } from '../product-option/product-option.entity';

import { ProductVariantAsset } from './product-variant-asset.entity';
import { ProductVariantPrice } from './product-variant-price.entity';
import { ProductVariantTranslation } from './product-variant-translation.entity';

/**
 * @description
 * A ProductVariant represents a single stock keeping unit (SKU) in the store's inventory.
 * Whereas a {@link Product} is a "container" of variants, the variant itself holds the
 * data on price, tax category etc. When one adds items to their cart, they are adding
 * ProductVariants, not Products.
 *
 * @docsCategory entities
 */
@Entity()
export class ProductVariant
    extends VendureEntity
    implements Translatable, HasCustomFields, SoftDeletable, ChannelAware
{
    constructor(input?: DeepPartial<ProductVariant>) {
        super(input);
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    name: LocaleString;

    @Column({ default: true })
    enabled: boolean;

    @Column()
    sku: string;

    /**
     * Calculated at run-time
     */
    listPrice: number;

    /**
     * Calculated at run-time
     */
    listPriceIncludesTax: boolean;

    /**
     * Calculated at run-time
     */
    currencyCode: CurrencyCode;

    @Calculated({
        expression: 'productvariant_productVariantPrices.price',
    })
    get price(): number {
        if (this.listPrice == null) {
            return 0;
        }
        return roundMoney(
            this.listPriceIncludesTax ? 0 : this.listPrice,
        );
    }

    @Calculated({
        // Note: this works fine for sorting by priceWithTax, but filtering will return inaccurate
        // results due to this expression not taking taxes into account. This is because the tax
        // rate is calculated at run-time in the application layer based on the current context,
        // and is unknown to the database.
        expression: 'productvariant_productVariantPrices.price',
    })
    get priceWithTax(): number {
        if (this.listPrice == null) {
            return 0;
        }
        return roundMoney(
            this.listPriceIncludesTax ? this.listPrice : 0,
        );
    }

    @Index()
    @ManyToOne(type => Asset, { onDelete: 'SET NULL' })
    featuredAsset: Asset;

    @OneToMany(type => ProductVariantAsset, productVariantAsset => productVariantAsset.productVariant, {
        onDelete: 'SET NULL',
    })
    assets: ProductVariantAsset[];

    @OneToMany(type => ProductVariantPrice, price => price.variant, { eager: true })
    productVariantPrices: ProductVariantPrice[];

    @OneToMany(type => ProductVariantTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductVariant>>;

    @Index()
    @ManyToOne(type => Product, product => product.variants)
    product: Product;

    @EntityId({ nullable: true })
    productId: ID;

    /**
     * @description
     * Specifies the value of stockOnHand at which the ProductVariant is considered
     * out of stock.
     */
    @Column({ default: 0 })
    outOfStockThreshold: number;

    /**
     * @description
     * When true, the `outOfStockThreshold` value will be taken from the GlobalSettings and the
     * value set on this ProductVariant will be ignored.
     */
    @Column({ default: true })
    useGlobalOutOfStockThreshold: boolean;

    @Column({ type: 'varchar', default: GlobalFlag.INHERIT })
    trackInventory: GlobalFlag;

    @ManyToMany(type => ProductOption)
    @JoinTable()
    options: ProductOption[];

    @Column(type => CustomProductVariantFields)
    customFields: CustomProductVariantFields;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
