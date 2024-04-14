from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import User    
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings

class MyUserManager(BaseUserManager):
    def create_user(self, username, email, date_of_birth, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model( username=username, email=email, date_of_birth=date_of_birth)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, date_of_birth, password=None, **extra_fields):
        user = self.create_user(
            username,
            email,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.is_staff = True 
        user.is_superuser = True  
        user.save(using=self._db)
        return user

class UserProfile(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True, null=True)
    date_of_birth = models.DateField()
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'date_of_birth']  

    def __str__(self):
        return self.username or "Unnamed User"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
class Room(models.Model):
    id = models.AutoField(primary_key=True)
    room_name = models.CharField(max_length=100)
    room_capacity = models.IntegerField()

    def __str__(self):
        return self.room_name or "Unnamed Room"

    
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.user.username

class Booking(models.Model):
    booking_room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    booking_start_time = models.DateTimeField()
    booking_end_time = models.DateTimeField()
    booking_created = models.DateTimeField(auto_now_add=True)
    booking_modified = models.DateTimeField(auto_now=True)
    booking_attendee = models.CharField(max_length=300, default='Unknown Attendee')
    
    def __str__(self):
        room_name = self.booking_room.room_name if self.booking_room else "No Room"
        return f"{room_name} ({self.booking_start_time} - {self.booking_end_time})"