from django.urls import path
from .views import PhotoUploadView, PhotoDetailView, PhotoListView, dashboard_stats, delete_all_photos

urlpatterns = [
    # Questo endpoint risponderà a /api/upload/
    path('upload/', PhotoUploadView.as_view(), name='photo-upload'),
    path('photos/<int:pk>/', PhotoDetailView.as_view(), name='photo-detail'),
    path('photos/', PhotoListView.as_view(), name='photo-list'),
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('photos/delete-all/', delete_all_photos, name='delete-all-photos'),
]