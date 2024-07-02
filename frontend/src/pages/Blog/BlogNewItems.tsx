import { useEffect, useSyncExternalStore } from 'react'
import { postsStore } from '../../data/postsStore';
import PostCard from '../../components/PostCard';

type Props = {}

export default function BlogNewItems({}: Props) {
    const posts = useSyncExternalStore(postsStore.subscribe.bind(postsStore), postsStore.getSnapshot.bind(postsStore));
    useEffect(() => {
        const refreshStore = async () => {
            await postsStore.loadNewItemsPosts()
        }
        if(!postsStore.newItemsLoaded) {
            refreshStore()
        }
    }, [posts])
    return (
        <article className="posts new-items" role="tabpanel" id="tab-notifications">
            {   posts.length !== 0 &&
                posts.map((item, key) => {
                    return (
                        item.category === 'new-items' && 
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