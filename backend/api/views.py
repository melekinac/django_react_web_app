from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets , permissions
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
# class UserGroupView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request , format=None):
#         groups = [group.name for group in request.user.groups.all()]
#         return Response(groups)

# class UserGroups(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, format=None):
#         # Extract user groups
#         groups = [group.name for group in request.user.groups.all()]
#         return Response(groups)

class UserGroups(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, format=None):
        groups = [group.name for group in request.user.groups.all()]
        return Response(groups)

# class RoomView(APIView):
#     # permission_classes = [IsAuthenticated]
#     permission_classes = [AllowAny] 
#     def get(self, request):
#         return Response({"message": "Access granted"})

# def home(request):
#     return HttpResponse("homepace")
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         UserProfile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny] 

class RoomViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            project = self.queryset.get(pk=pk)
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(project, context={'request': request})
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            project = self.queryset.get(pk=pk)
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(project, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            project = self.queryset.get(pk=pk)
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)


class MyObtainTokenPairView(TokenObtainPairView):
    serializer_class = MyObtainTokenPairSerializer


class UserInfoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get(self, request):
        user = request.user
        print("Request user", user)
        return Response({
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_admin': user.is_admin,
        })