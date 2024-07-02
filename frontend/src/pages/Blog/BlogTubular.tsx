import { useEffect, useSyncExternalStore } from 'react'
import { postsStore } from '../../data/postsStore';
import PostCard from '../../components/PostCard';

type Props = {}

export default function BlogTubular({}: Props) {
    const posts = useSyncExternalStore(postsStore.subscribe.bind(postsStore), postsStore.getSnapshot.bind(postsStore));
    useEffect(() => {
        const refreshStore = async () => {
            await postsStore.loadTubularsPosts()
        }
        if(!postsStore.tubularsLoaded) {
            refreshStore()
        }
    }, [posts])
    return (
        <article className="posts tubular" role="tabpanel" id="tab-notifications">
            {   posts.length !== 0 &&
                posts.map((item, key) => {
                    return (
                        item.category === 'tubulars' && 
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