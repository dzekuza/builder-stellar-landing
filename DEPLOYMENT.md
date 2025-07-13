# EventFlow Deployment Guide

## Netlify Deployment

### Prerequisites

1. **Prisma Accelerate Database**: Set up a PostgreSQL database with Prisma Accelerate
2. **Resend Account**: Create an account at [resend.com](https://resend.com) for email functionality
3. **Domain (optional)**: Verify your domain in Resend for sending emails

### Environment Variables

Set the following environment variables in your Netlify dashboard:

```bash
# Database Configuration
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-here"

# Application Environment
NODE_ENV="production"

# Resend Email API Configuration
RESEND_API_KEY="re_YOUR_RESEND_API_KEY_HERE"

# Email Configuration (your verified domain)
EMAIL_FROM_DOMAIN="your-domain.com"
```

### Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Netlify

2. **Configure Build Settings**:

   - Build command: `npm run build:client`
   - Publish directory: `dist/spa`
   - Functions directory: `netlify/functions`

3. **Set Environment Variables**: Add all the environment variables listed above in Netlify dashboard

4. **Database Setup**:

   - Make sure your Prisma database is set up with the schema
   - Run database migrations if needed
   - The app will connect to your database using the `DATABASE_URL`

5. **Email Setup**:

   - Verify your domain in Resend
   - Add your Resend API key to environment variables
   - Update `EMAIL_FROM_DOMAIN` with your verified domain

6. **Deploy**: Trigger a new deployment from Netlify dashboard

### Testing Deployment

After deployment, you can test the email functionality by:

1. Register a new account
2. Create an event (should send email notification)
3. Test the invite functionality from company dashboard

### Troubleshooting

- **Database Connection Issues**: Verify your `DATABASE_URL` is correct and the database is accessible
- **Email Issues**: Check your Resend API key and domain verification
- **Build Failures**: Check the build logs in Netlify dashboard
- **Function Timeouts**: Netlify functions have a 10-second timeout limit

### Features Included

- ✅ Dark theme role selection interface
- ✅ Calendar view with clickable month/year selectors
- ✅ Real database integration (no mock data)
- ✅ Email notifications with Resend
- ✅ Team invitation functionality
- ✅ Responsive design
- ✅ Role-based dashboards (DJ, Barista, Host, Company)
- ✅ Event management with live updates
- ✅ Song request and drink order systems

### Support

If you encounter any issues during deployment, check:

1. Netlify build logs
2. Function logs
3. Browser console for frontend errors
4. Database connectivity
5. Email service configuration
