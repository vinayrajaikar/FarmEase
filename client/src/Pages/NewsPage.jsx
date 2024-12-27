import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { getAllNews,uploadNews } from "../Redux/Slices/newsSlice";
import {adddLike} from "../Redux/Slices/likeSlice"
import { useDispatch} from "react-redux";

function NewsPage() {
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostLink, setNewPostLink] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [news, setNews] = useState([]); // State to store fetched news
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res =await dispatch(getAllNews()); 
        setNews(res.payload.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [dispatch]);

  const handleCreatePost = async () => {
    const newpost={
      content: newPostContent,
      link: newPostLink
    }

    const res= await dispatch(uploadNews(newpost));
    console.log(res);
    console.log("Helooo")
    if(res.type=="uploadNews/fulfilled"){
      alert("News uploaded successfully");
    }
    setNewPostContent("");
    setNewPostLink("");
    // setShowCreatePost(false);
  };

  const handleLike = async (post) => {
    const res = await dispatch(adddLike(post._id)); 
    console.log(res.payload.data);
  
    if (res.type === "adddLike/fulfilled") {
      setNews(news.map((item) => 
        item._id === post._id 
          ? { 
              ...item, 
              likeCount: post.likedByUser 
                ? post.likeCount - 1
                : post.likeCount + 1,
              likedByUser: !post.likedByUser 
            }
          : item
      ));
    }
  };
  
  

  // const handleDislike = (postId) => {
  //   setNews(news.map((post) => (post._id === postId ? { ...post, dislikeCount: post.dislikeCount + 1 } : post)));
  // };

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
                onClick={handleCreatePost}
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
        {news.map((post) => (
          <Card key={post._id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={post.avatar || "/placeholder-avatar.png"} alt={post.user} />
                  <AvatarFallback>{post.userName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{post.userName}</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-left">
                {expandedPosts[post._id]
                  ? post.content
                  : `${post.content.slice(0, 100)}${post.content.length > 100 ? "..." : ""}`}
              </p>
              <div className="mb-4 flex justify-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePostExpansion(post._id)}
                  className="bg-transparent"
                >
                  {expandedPosts[post._id] ? (
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

              {expandedPosts[post._id] && post.link && (
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
                <Button variant="outline" size="sm" onClick={() => handleLike(post)}>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {post.likeCount}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDislike(post._id)}>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  {post.dislikeCount}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default NewsPage;
