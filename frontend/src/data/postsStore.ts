import { ipost } from "post";

interface IPostsExternalStore {
    loadGeneralPosts: () => void;
    loadNewItemsPosts: () => void;
    loadOffersPosts: () => void;
    loadRelatedPosts: () => void;
    loadTubularsPosts: () => void;
    loadBPSPosts: () => void;
    subscribe: (listener: () => void) => () => void;
    getSnapshot(): ipost[]
}

export class PostsExternalStore implements IPostsExternalStore {
    private postItems: ipost[] = []
    private listeners: (() => void)[] = [];
    
    public generalLoaded: boolean = false
    public newItemsLoaded: boolean = false
    public offersLoaded: boolean = false
    public relatedLoaded: boolean = false
    public tubularsLoaded: boolean = false
    public bpsLoaded: boolean = false
    public async loadGeneralPosts() {
        setTimeout(() => {
            this.postItems = this.postItems.concat([
                {
                    id: '1',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'Introduction to our Services',
                    publishDate: new Date('2024-01-01'),
                    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed cum, eum quos doloremque nemo tenetur rem? Cum culpa incidunt tenetur pariatur qui perspiciatis error reprehenderit, architecto voluptate quasi quos eius!',
                    category: 'general'
                },
                {
                    id: '7',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'General Maintenance Tips',
                    publishDate: new Date('2024-01-30'),
                    text: 'Keep your equipment in top shape with these general maintenance tips.',
                    category: 'general'
                }
            ])
            this.generalLoaded = true
            this.emitChange();
        }, 2000);
    }
    public async loadNewItemsPosts() {
        setTimeout(() => {
            this.postItems = this.postItems.concat([
                {
                    id: '2',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'New Arrivals: January 2024',
                    publishDate: new Date('2024-01-05'),
                    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed cum, eum quos doloremque nemo tenetur rem? Cum culpa incidunt tenetur pariatur qui perspiciatis error reprehenderit, architecto voluptate quasi quos eius!',
                    category: 'new-items'
                }
            ]);
            this.newItemsLoaded = true
            this.emitChange();
        }, 2000);
    }
    public async loadOffersPosts() {
        setTimeout(() => {
            this.postItems = this.postItems.concat([
                {
                    id: '6',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'Special Offers for January',
                    publishDate: new Date('2024-01-25'),
                    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed cum, eum quos doloremque nemo tenetur rem? Cum culpa incidunt tenetur pariatur qui perspiciatis error reprehenderit, architecto voluptate quasi quos eius!',
                    category: 'offers'
                },
                {
                    id: '10',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'February Offers',
                    publishDate: new Date('2024-02-10'),
                    text: 'Don’t miss out on our special offers available only in February.',
                    category: 'offers'
                }
            ]);
            this.offersLoaded = true
            this.emitChange();
        }, 2000);
    }
    public async loadRelatedPosts() {
        setTimeout(() => {
            this.postItems = this.postItems.concat([
                {
                    id: '5',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'Customer Success Stories',
                    publishDate: new Date('2024-01-20'),
                    text: 'Read about how our products and services have helped customers achieve their goals.',
                    category: 'related'
                }
            ]);
            this.relatedLoaded = true
            this.emitChange();
        }, 2000);
    }
    public async loadTubularsPosts() {
        setTimeout(() => {
            this.postItems = this.postItems.concat([
                {
                    id: '3',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'Tubular Products Now Available',
                    publishDate: new Date('2024-01-10'),
                    text: 'Explore our new range of tubular products, designed for durability and performance.',
                    category: 'tubulars'
                },
                {
                    id: '8',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'New Tubular Designs',
                    publishDate: new Date('2024-02-01'),
                    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed cum, eum quos doloremque nemo tenetur rem? Cum culpa incidunt tenetur pariatur qui perspiciatis error reprehenderit, architecto voluptate quasi quos eius!',
                    category: 'tubulars'
                }
            ]);
            this.tubularsLoaded = true
            this.emitChange();
        }, 2000);
    }
    public async loadBPSPosts() {
        setTimeout(() => {
            this.postItems = this.postItems.concat([
                {
                    id: '4',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'BPS Innovations for 2024',
                    publishDate: new Date('2024-01-15'),
                    text: 'Discover the latest innovations in BPS technology and how they can benefit your business.',
                    category: 'BPS'
                },
                {
                    id: '9',
                    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Post_%28South_Africa%29.gif',
                    name: 'BPS: The Future is Here',
                    publishDate: new Date('2024-02-05'),
                    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed cum, eum quos doloremque nemo tenetur rem? Cum culpa incidunt tenetur pariatur qui perspiciatis error reprehenderit, architecto voluptate quasi quos eius!',
                    category: 'BPS'
                }
            ]);
            this.bpsLoaded = true
            this.emitChange();
        }, 2000);
    }
    public subscribe(listener: () => void):  () => void  {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getSnapshot(): ipost[] {
        return this.postItems;
    }

    private emitChange() {
        for (let listener of this.listeners) {
            listener();
        }
    };
}

export const postsStore = new PostsExternalStore();