from django.urls import path
from .views import * 
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register('Room' ,RoomViewSet ,basename='room')
router.register('Bookings', BookingViewSet,basename='bookings')
# router.register('Attendees', AttendeesViewSet,basename='attendees')
urlpatterns=router.urls


urlpatterns += [
    path('UserInfo/', UserInfoAPIView.as_view(), name='user-info'),
    path('api/token/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
]
