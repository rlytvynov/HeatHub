import { useEffect, useSyncExternalStore } from 'react'
import { postsStore } from '../../data/postsStore';
import PostCard from '../../components/PostCard';

type Props = {}

export default function BlogBPS({}: Props) {
    const posts = useSyncExternalStore(postsStore.subscribe.bind(postsStore), postsStore.getSnapshot.bind(postsStore));
    useEffect(() => {
        const refreshStore = async () => {
            await postsStore.loadBPSPosts()
        }
        if(!postsStore.bpsLoaded) {
            refreshStore()
        }
    }, [posts])
    return (
        <article className="posts bps" role="tabpanel" id="tab-notifications">
            {   posts.length !== 0 &&
                posts.map((item, key) => {
                    return (
                        item.category === 'BPS' &&
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