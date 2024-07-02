import { useState } from 'react'
import "../../styles/pages/Blog.css"
import BlogGeneral from './BlogGeneral'
import BlogNewItems from './BlogNewItems'
import BlogTubular from './BlogTubular'
import BlogBPS from './BlogBPS'
import BlogRelated from './BlogRelated'
import BlogOffers from './BlogOffers'

const enum Tab {
    general, newItems, tubular, related, BPS, offers
}

export default function Blog() {
    const [currentTab, setCurrentTab] = useState(Tab.general)
    return (
        <div>
            <h2 style={{marginTop: 0}}>Blog</h2>
            <menu id='posts' role="tablist">
                <button role='tab' onClick={() => setCurrentTab(Tab.general)} aria-controls="general" aria-selected={currentTab === Tab.general} >General</button>
                <button role='tab' onClick={() => setCurrentTab(Tab.newItems)} aria-controls="new-items" aria-selected={currentTab === Tab.newItems}><strong style={{color: "red"}}>New items</strong></button>
                <button role='tab' onClick={() => setCurrentTab(Tab.tubular)} aria-controls="tubular" aria-selected={currentTab === Tab.tubular}>THE - how and for what</button>
                <button role='tab' onClick={() => setCurrentTab(Tab.BPS)} aria-controls="BPS" aria-selected={currentTab === Tab.BPS}><strong style={{color: "red"}}>Backup power supply</strong></button>
                <button role='tab' onClick={() => setCurrentTab(Tab.related)} aria-controls="related" aria-selected={currentTab === Tab.related}>Related products</button>
                <button role='tab' onClick={() => setCurrentTab(Tab.offers)} aria-controls="offers" aria-selected={currentTab === Tab.offers}>Offers</button>
            </menu>
            {currentTab === Tab.general && <BlogGeneral/>}
            {currentTab === Tab.newItems && <BlogNewItems/>}
            {currentTab === Tab.tubular && <BlogTubular/>}
            {currentTab === Tab.BPS && <BlogBPS/>}
            {currentTab === Tab.related && <BlogRelated/>}
            {currentTab === Tab.offers && <BlogOffers/>}   
        </div>
    )
}