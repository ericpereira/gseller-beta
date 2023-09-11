
declare module '@vendure/common/lib/generated-types' {

    enum ChannelSocialMediaName {
        FACEBOOK = 'FACEBOOK',
        TWITTER = 'TWITTER',
        INSTAGRAM = 'INSTAGRAM',
        YOUTUBE = 'YOUTUBE',
        LINKEDIN = 'LINKEDIN',
        PINTEREST = 'PINTEREST',
        SNAPCHAT = 'SNAPCHAT',
        TIKTOK = 'TIKTOK',
        REDDIT = 'REDDIT',
        WHATSAPP = 'WHATSAPP',
        WECHAT = 'WECHAT',
        DISCORD = 'DISCORD',
        TELEGRAM = 'TELEGRAM',
        MEDIUM = 'MEDIUM',
        QUORA = 'QUORA',
        GOOGLE_PLUS = 'GOOGLE_PLUS',
        VKONTAKTE = 'VKONTAKTE',
        SINA_WEIBO = 'SINA_WEIBO',
        LINE = 'LINE',
        SKYPE = 'SKYPE',
        PERISCOPE = 'PERISCOPE',
        SOUNDCLOUD = 'SOUNDCLOUD',
        TWITCH = 'TWITCH',
        VIMEO = 'VIMEO',
        DRIBBBLE = 'DRIBBBLE',
        BEHANCE = 'BEHANCE',
        GOODREADS = 'GOODREADS',
        MEETUP = 'MEETUP',
        SLIDESHARE = 'SLIDESHARE',
        MIXCLOUD = 'MIXCLOUD',
        XING = 'XING',
        RENREN = 'RENREN',
    }


    interface CreateChannelSocialMediaInput {
        nome: ChannelSocialMediaName;
        link: string;
    }

    interface UpdateChannelSocialMediaInput {
        nome?: ChannelSocialMediaName;
        link?: string;
    }
}




