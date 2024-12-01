import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Link2, ChevronDown, ChevronUp } from 'lucide-react';
import { uploadNews, updateNews, deleteNews, getAllNews } from '../Redux/Slices/newsSlice';

function NewsPage() {
  const dispatch = useDispatch();
  const { newsDetails, loading, status } = useSelector((state) => state.news);

  const [newPostContent, setNewPostContent] = useState('');
  const [newPostLink, setNewPostLink] = useState('');
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false); // Toggle visibility of "Create New Post" card

  // Fetch all news posts on mount
  useEffect(() => {
    dispatch(getAllNews());
  }, [dispatch]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPost = {
      content: newPostContent,
      link: newPostLink,
    };
    dispatch(uploadNews(newPost)); // Upload new post
    setNewPostContent('');
    setNewPostLink('');
    setShowCreatePost(false); // Hide form after submitting
  };

  const handleLike = (postId) => {
    // Handle like logic
    const updatedPost = newsDetails.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    dispatch(updateNews({ newsId: postId, details: updatedPost }));
  };

  const handleDislike = (postId) => {
    // Handle dislike logic
    const updatedPost = newsDetails.map((post) =>
      post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
    );
    dispatch(updateNews({ newsId: postId, details: updatedPost }));
  };

  const handleDeletePost = (postId) => {
    dispatch(deleteNews(postId)); // Delete post
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Toggle button for creating a new post */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="w-full sm:w-auto bg-[#6EE7B7] text-gray-800 hover:bg-[#6EE7B7]/80 transition-colors"
        >
          {showCreatePost ? "Cancel" : "Create New Post"}
        </Button>
      </div>

      {/* Create new post form */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <h2 className="text-lg text-left font-semibold">Create a New Post</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
              />
              <Input
                type="url"
                placeholder="Add a link (optional)"
                value={newPostLink}
                onChange={(e) => setNewPostLink(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#6EE7B7] text-gray-800 hover:bg-[#6EE7B7]/80 transition-colors"
              >
                Post
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List of posts */}
      <div className="space-y-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          newsDetails?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback>{post.author.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.author}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-left">
                  {expandedPosts[post.id]
                    ? post.content
                    : `${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}`}
                </p>
                <div className="mb-4 flex justify-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePostExpansion(post.id)}
                    className="bg-transparent"
                  >
                    {expandedPosts[post.id] ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Read less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Read more
                      </>
                    )}
                  </Button>
                </div>

                {expandedPosts[post.id] && post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    {post.link}
                  </a>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {post.likes}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDislike(post.id)}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    {post.dislikes}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default NewsPage;
