# Django Social Network

A portfolio Django social network demonstrating authentication, profiles, posts, relationships, and lightweight AJAX interactions in a familiar server-rendered architecture.

## Features

- Django Allauth email/username authentication and account settings
- User profiles with bios and optional avatars
- Text and image posts with Cloudinary-backed media storage
- Likes, comments, and notification records
- Follow/unfollow relationships with duplicate-follow protection
- Home and following feeds
- AJAX follow, like, and comment interactions
- Responsive Tailwind CSS UI with light/dark theme support

## Technology and architecture

- Python and Django
- Django Allauth
- SQLite for local development and PostgreSQL (via `DATABASE_URL`) in production
- Cloudinary and `django-cloudinary-storage` for uploaded media
- WhiteNoise for static files
- Render deployment using `build.sh` and Gunicorn

The project is split into focused Django apps:

- `feed`: posts, likes, comments, feeds, and related views
- `profiles`: profile model, account settings, avatars, and profile pages
- `followers`: follow relationships
- `notifications`: activity notifications
- `mysite`: project settings and URL configuration

## Environment variables

Copy `.env.example` to `.env` for local work. Never commit `.env` or production credentials.

`DJANGO_ENV=development` keeps local setup convenient. In production set `DEBUG=False`, `DJANGO_SECRET_KEY`, `DATABASE_URL`, and `ALLOWED_HOSTS` (or `RENDER_EXTERNAL_HOSTNAME`). Render HTTPS proxy and secure-cookie settings are configured automatically when `DEBUG=False`. Cloudinary variables are required for hosted media storage. Production SMTP settings are optional until email features are enabled, but must be supplied when using the SMTP backend.

## Local installation

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
python manage.py migrate
python manage.py runserver
```

SQLite is used locally when `DEBUG=True` and no `DATABASE_URL` is set.

## Tests and checks

```bash
python manage.py check
python manage.py test
```

## Render deployment

Create a Render web service from the repository, use `build.sh` as the build command, and start Gunicorn with:

```bash
gunicorn mysite.wsgi:application
```

Set the production environment variables in Render before deploying. The build script installs dependencies, collects static files, and runs migrations.

## Security considerations

Production requires an environment-provided secret key and database URL, validates allowed hosts, trusts Render's forwarded HTTPS header, and enables secure cookies and HSTS. Uploaded avatars and post images retain extension and size validation. Django template autoescaping remains enabled.

## Current limitations and future improvements

This is intentionally a small portfolio project rather than a production SaaS application. It does not yet include pagination, moderation/reporting tools, rich text editing, email notification workflows, or a comprehensive API. Future improvements could add those features, improve accessibility coverage, and add more focused integration tests as the application grows.
