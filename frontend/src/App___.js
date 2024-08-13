import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CommunityForm from './components/Communityform';
import CommunityDetail from './components/Communitydetail';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  views: number;
  comments: number;
  files?: any[];
}

function App() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const storedPosts = localStorage.getItem('posts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  });

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  return (
    <Router>
      <Routes>
        <Route path="/community" element={<CommunityForm posts={posts} setPosts={setPosts} />} />
        <Route path="/community/:id" element={<CommunityDetail posts={posts} setPosts={setPosts} />} />
      </Routes>
    </Router>
  );
}

export default App;
