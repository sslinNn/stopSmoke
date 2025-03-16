import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/posts', {
        credentials: 'include'
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Не удалось загрузить сообщения сообщества');
      }

      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newPost }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Не удалось опубликовать сообщение');
      }
      
      // Обновляем список постов
      fetchPosts();
      // Очищаем форму
      setNewPost('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Не удалось поставить лайк');
      }
      
      // Обновляем список постов
      fetchPosts();
      
    } catch (err) {
      console.error('Ошибка при лайке:', err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">Сообщество поддержки</h2>
          <p>Делись своим опытом, задавай вопросы и получай поддержку от тех, кто тоже бросает курить</p>
          
          {error && (
            <div className="alert alert-error mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmitPost} className="mt-4">
            <div className="form-control">
              <textarea 
                className="textarea textarea-bordered h-24" 
                placeholder="Поделись своими мыслями, достижениями или задай вопрос..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-control mt-4">
              <button 
                type="submit" 
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting || !newPost.trim()}
              >
                Опубликовать
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">Пока нет сообщений. Будь первым!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img src={post.author.avatar_url || '/placeholder-avatar.jpg'} alt="Аватар" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{post.author.username}</h3>
                    <p className="text-xs opacity-70">{post.created_at} • {post.author.days_without_smoking} дней без курения</p>
                  </div>
                </div>
                
                <p className="mt-4">{post.content}</p>
                
                <div className="card-actions justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className={`btn btn-sm btn-circle ${post.liked_by_me ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <span>{post.likes_count}</span>
                  </div>
                  
                  <button className="btn btn-sm btn-ghost">
                    Ответить
                  </button>
                </div>
                
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="w-6 h-6 rounded-full">
                              <img src={comment.author.avatar_url || '/placeholder-avatar.jpg'} alt="Аватар" />
                            </div>
                          </div>
                          <span className="font-bold text-sm">{comment.author.username}</span>
                          <span className="text-xs opacity-70">{comment.created_at}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityPage; 