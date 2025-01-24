from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, UserSerializer


class PostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch posts and prefetch related comments to reduce queries
        posts = Post.objects.prefetch_related('comment_set').all()
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        # Fetch comments for the specific post
        comments = Comment.objects.filter(post_id=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, post_id):
            # Validate that the post exists
        post = get_object_or_404(Post, id=post_id)

        # Prepare the data
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            # Pass the user and post explicitly when saving
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
            data = request.data.copy()
            if not request.FILES.get('image') and 'image' not in data:
                data['image'] = post.image
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found or you don't have permission to edit it."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
            post.delete()
            return Response({"message": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({"error": "Post not found or you don't have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)


class CommentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id, user=request.user)
            serializer = CommentSerializer(comment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                post = Post.objects.prefetch_related('comment_set').get(id=comment.post_id)
                post_serializer = PostSerializer(post, context={'request': request})
                return Response(post_serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found or you don't have permission to edit it."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id, user=request.user)
            post_id = comment.post_id
            comment.delete()
            # Return the entire updated post with its comments
            post = Post.objects.prefetch_related('comment_set').get(id=post_id)
            post_serializer = PostSerializer(post, context={'request': request})
            return Response(post_serializer.data, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found or you don't have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)
