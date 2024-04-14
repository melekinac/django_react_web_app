from rest_framework import serializers
from .models import *
from django.urls import reverse
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
       
        return data
    

class RoomSerializer(serializers.ModelSerializer):
    room_url = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = '__all__'

    def get_room_url(self, obj):
 
        request = self.context.get('request')
       
        if request:
            return request.build_absolute_uri(reverse('room-detail', args=[obj.pk]))
        return reverse('room-detail', args=[obj.pk])



@api_view(['PUT'])
def room_update(request, pk):
    try:
        room = Room.objects.get(pk=pk)
    except Room.DoesNotExist:
        return Response(status=404)

    serializer = RoomSerializer(room, data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__' 



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    class Meta:
        model = Profile
        fields = ('user', 'first_name', 'last_name', 'email')



# class MyObtainTokenPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)

#         # Add custom claims
#         data['username'] = self.user.username
#         data['email'] = self.user.email
#         # User role
#         data['is_staff'] = self.user.is_staff

#         return data

class MyObtainTokenPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

      
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_staff'] = self.user.is_staff

        return data
