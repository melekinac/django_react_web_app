from django.contrib import admin
from .models import *
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_of_birth', 'is_admin', 'get_groups')
    search_fields = ('username', 'email')
    ordering = ('username',)
    filter_horizontal = ()

    def get_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])
    get_groups.short_description = 'Groups'

admin.site.register(UserProfile, UserAdmin)

admin.site.register(Room)
admin.site.register(Booking)
admin.site.register(Profile)
