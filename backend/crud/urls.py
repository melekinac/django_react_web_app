from django.contrib import admin
from django.urls import path, include
from api.views import UserGroups
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import MyObtainTokenPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('api/groups/', UserGroups.as_view(), name='user-groups'),
    path('api/token/', MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]

