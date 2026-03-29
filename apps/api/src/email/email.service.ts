import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendMagicLink(to: string, token: string, magicLinkBaseUrl: string): Promise<void> {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!isProduction && !apiKey) {
      this.logger.log(`[DEV MODE] Magic link token for ${to}: ${token}`);
      return;
    }

    if (!this.resend) {
      this.logger.warn(
        'Resend API key not configured. Magic link email will not be sent.',
      );
      return;
    }

    const emailFrom = this.configService.get<string>(
      'EMAIL_FROM',
      'noreply@skylive.tv',
    );
    const magicLink = `${magicLinkBaseUrl}?token=${token}`;

    const htmlContent = this.generateMagicLinkEmail(magicLink);

    try {
      await this.resend.emails.send({
        from: emailFrom,
        to,
        subject: 'Votre lien de connexion Skylive',
        html: htmlContent,
      });

      this.logger.log(`Magic link email sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send magic link email to ${to}`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  private generateMagicLinkEmail(magicLink: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: #0a0a0a;
            color: #e0e0e0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1a1a;
            border: 1px solid #333;
        }
        .header {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 20px;
            text-align: center;
            border-bottom: 1px solid #333;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .header p {
            color: #999;
            font-size: 14px;
        }
        .content {
            padding: 40px 30px;
        }
        .content p {
            margin-bottom: 20px;
            color: #e0e0e0;
            font-size: 16px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            color: #ffffff;
            padding: 14px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 30px 0;
            transition: opacity 0.2s;
        }
        .cta-button:hover {
            opacity: 0.9;
        }
        .token-section {
            background-color: #0a0a0a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .token-section p {
            margin-bottom: 10px;
            color: #999;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .token {
            color: #7c3aed;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        .footer {
            background-color: #0a0a0a;
            padding: 30px 20px;
            border-top: 1px solid #333;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .footer a {
            color: #7c3aed;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .warning {
            background-color: #3d1d1d;
            border-left: 4px solid #dc2626;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Skylive</h1>
            <p>Plateforme de livestream</p>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé un lien de connexion pour accéder à votre compte Skylive. Cliquez sur le bouton ci-dessous pour vous connecter :</p>

            <div style="text-align: center;">
                <a href="${magicLink}" class="cta-button">Accéder à mon compte</a>
            </div>

            <p style="color: #999; font-size: 14px;">Ou copiez ce lien dans votre navigateur :</p>
            <div class="token-section">
                <p>Lien de connexion</p>
                <div class="token">${magicLink}</div>
            </div>

            <div class="warning">
                <strong>Important :</strong> Ce lien expire dans 15 minutes. Si vous n'avez pas demandé ce lien, ignorez cet email.
            </div>

            <p style="color: #999; font-size: 14px; margin-top: 30px;">À bientôt sur Skylive !</p>
        </div>
        <div class="footer">
            <p>© 2025 Skylive. Tous droits réservés.</p>
            <p style="margin-top: 10px;">
                <a href="https://skylive.tv">skylive.tv</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}
