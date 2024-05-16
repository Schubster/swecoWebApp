from django.utils.deprecation import MiddlewareMixin
from .models import BlacklistedToken
import jwt
from django.http import JsonResponse

class JWTBlacklistMiddleware(MiddlewareMixin):
    def process_request(self, request):
        authorization_header = request.headers.get('Authorization')

        if authorization_header:
            token = authorization_header.split(' ')[1]
            if BlacklistedToken.objects.filter(token=token).exists():
                return JsonResponse({'error': 'Invalid token'}, status=401)
        return None