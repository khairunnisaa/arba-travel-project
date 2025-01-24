from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import PostView, CommentView, RegisterView,PostDetailView,CommentDetailView

urlpatterns = [
     # Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User registration
    path('register/', RegisterView.as_view(), name='register'),

    # Posts and comments
    path('posts/', PostView.as_view(), name='posts'),
    path('posts/<int:post_id>/comments/', CommentView.as_view(), name='comments'),

    path('posts/<int:post_id>/', PostDetailView.as_view(), name='post_detail'),
    path('comments/<int:comment_id>/', CommentDetailView.as_view(), name='comment_detail'),
]