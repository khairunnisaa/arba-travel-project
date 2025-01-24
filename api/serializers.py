from rest_framework import serializers
from .models import User, Post, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username') 
    image = serializers.ImageField(required=False, use_url=True) 

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption']
        read_only_fields = ['id', 'user']  


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  
    post = serializers.ReadOnlyField(source='post.id') 

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'text']  
