import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const stockStatusExtension = gql`

    extend input SearchInput {
        inStock: Boolean
    }
`;
