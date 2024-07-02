import { useEffect, useSyncExternalStore } from 'react'
import { postsStore } from '../../data/postsStore';
import PostCard from '../../components/PostCard';

type Props = {}

export default function BlogOffers({}: Props) {
    const posts = useSyncExternalStore(postsStore.subscribe.bind(postsStore), postsStore.getSnapshot.bind(postsStore));
    useEffect(() => {
        const refreshStore = async () => {
            await postsStore.loadOffersPosts()
        }
        if(!postsStore.offersLoaded) {
            refreshStore()
        }
    }, [posts])
    return (
        <article className="posts offers" role="tabpanel" id="tab-notifications">
            {   posts.length !== 0 &&
                posts.map((item, key) => {
                    return (
                        item.category === 'offers' && 
                        <PostCard 
                            key={key}
                            {...item}
                        />
                    ) 
                })
            }
        </article>
    )
}