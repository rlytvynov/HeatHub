import { useEffect, useSyncExternalStore } from 'react'
import { postsStore } from '../../data/postsStore';
import PostCard from '../../components/PostCard';

type Props = {}

export default function BlogGeneral({}: Props) {
    const posts = useSyncExternalStore(postsStore.subscribe.bind(postsStore), postsStore.getSnapshot.bind(postsStore));
    useEffect(() => {
        const refreshStore = async () => {
            await postsStore.loadGeneralPosts()
        }
        if(!postsStore.generalLoaded) {
            refreshStore()
        }
    }, [posts])
    return (
        <article className="posts general" role="tabpanel" id="tab-notifications">
            {   posts.length !== 0 &&
                posts.map((item, key) => {
                    return (
                        item.category === 'general' && 
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