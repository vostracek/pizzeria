// backend/services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // SMTP konfigurace - použij Gmail, Seznam.cz nebo jiný provider
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // Nebo 'seznam' pro seznam.cz
      auth: {
        user: process.env.EMAIL_USER,     // např. pizzafresca@gmail.com
        pass: process.env.EMAIL_PASSWORD  // App password z Gmail
      }
    });
  }

  // POTVRZENÍ OBJEDNÁVKY PRO ZÁKAZNÍKA
  async sendOrderConfirmation(order) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.customerInfo.email,
        subject: `Pizza Fresca - Potvrzení objednávky #${order.orderNumber}`,
        html: this.getOrderConfirmationTemplate(order)
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email potvrzení odeslán zákazníkovi:', order.customerInfo.email);
    } catch (error) {
      console.error('❌ Chyba při odesílání potvrzení:', error);
    }
  }

  // NOTIFIKACE NOVÉ OBJEDNÁVKY PRO MAJITELE
  async sendNewOrderNotification(order) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.OWNER_EMAIL, // Email majitele pizzerie
        subject: `🍕 NOVÁ OBJEDNÁVKA #${order.orderNumber} - ${order.totalPrice} Kč`,
        html: this.getOwnerNotificationTemplate(order)
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email notifikace odeslán majiteli');
    } catch (error) {
      console.error('❌ Chyba při odesílání notifikace majiteli:', error);
    }
  }

  // POTVRZENÍ REZERVACE
  async sendReservationConfirmation(reservation) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reservation.email,
        subject: 'Pizza Fresca - Potvrzení rezervace stolu',
        html: this.getReservationTemplate(reservation)
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email potvrzení rezervace odeslán:', reservation.email);
    } catch (error) {
      console.error('❌ Chyba při odesílání potvrzení rezervace:', error);
    }
  }

  // STATUS UPDATE OBJEDNÁVKY
  async sendOrderStatusUpdate(order, oldStatus, newStatus) {
    if (!order.customerInfo.email) return;

    try {
      const statusMessages = {
        'confirmed': 'Vaše objednávka byla potvrzena a brzy začneme s přípravou.',
        'preparing': 'Vaše pizza se právě připravuje v naší kamenné peci!',
        'ready': 'Vaše pizza je připravena k vyzvednutí/doručení.',
        'delivered': 'Vaše objednávka byla úspěšně doručena. Děkujeme!',
        'cancelled': 'Bohužel jsme museli vaši objednávku zrušit. Omluvíme se.'
      };

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.customerInfo.email,
        subject: `Pizza Fresca - Aktualizace objednávky #${order.orderNumber}`,
        html: this.getStatusUpdateTemplate(order, newStatus, statusMessages[newStatus])
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Status update email odeslán: ${oldStatus} → ${newStatus}`);
    } catch (error) {
      console.error('❌ Chyba při odesílání status update:', error);
    }
  }

  // TEMPLATE PRO POTVRZENÍ OBJEDNÁVKY
  getOrderConfirmationTemplate(order) {
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.quantity}× ${item.pizza.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.price * item.quantity} Kč
        </td>
      </tr>`
    ).join('');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #e53e3e, #dd6b20); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🍕 Pizza Fresca</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Potvrzení vaší objednávky</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px;">
        <h2 style="color: #2d3748; margin-top: 0;">Děkujeme za vaši objednávku!</h2>
        
        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4a5568;">Objednávka #${order.orderNumber}</h3>
          <p><strong>Zákazník:</strong> ${order.customerInfo.name}</p>
          <p><strong>Telefon:</strong> ${order.customerInfo.phone}</p>
          <p><strong>Typ:</strong> ${order.orderType === 'delivery' ? '🚚 Rozvoz' : '🏃 Vyzvednutí'}</p>
          ${order.orderType === 'delivery' ? `<p><strong>Adresa:</strong> ${order.customerInfo.address}, ${order.customerInfo.city}</p>` : ''}
          <p><strong>Objednáno:</strong> ${new Date(order.createdAt).toLocaleString('cs-CZ')}</p>
        </div>

        <h3 style="color: #4a5568;">Vaše objednávka:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          ${itemsList}
          <tr>
            <td style="padding: 15px 10px; border-top: 2px solid #e53e3e; font-weight: bold;">
              CELKEM
            </td>
            <td style="padding: 15px 10px; border-top: 2px solid #e53e3e; text-align: right; font-weight: bold; color: #e53e3e;">
              ${order.totalPrice} Kč
            </td>
          </tr>
        </table>

        ${order.customerInfo.notes ? `<p><strong>Poznámka:</strong> ${order.customerInfo.notes}</p>` : ''}

        <div style="background: #e6fffa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #065f46;">📞 Kontakt</h4>
          <p style="margin: 5px 0;"><strong>Telefon:</strong> 722 272 252</p>
          <p style="margin: 5px 0;"><strong>Adresa:</strong> Hany Kvapilové 19, Praha 4</p>
          <p style="margin: 5px 0;"><strong>Otevírací doba:</strong> Po-So 17:00-20:30</p>
        </div>

        <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
          Děkujeme, že jste si vybrali Pizza Fresca!<br>
          Těšíme se na vás! 🍕
        </p>
      </div>
    </div>
    `;
  }

  // TEMPLATE PRO MAJITELE O NOVÉ OBJEDNÁVCE
  getOwnerNotificationTemplate(order) {
    const itemsList = order.items.map(item => 
      `• ${item.quantity}× ${item.pizza.name} (${item.price * item.quantity} Kč)`
    ).join('<br>');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🚨 NOVÁ OBJEDNÁVKA</h1>
        <h2 style="margin: 10px 0 0;">Objednávka #${order.orderNumber}</h2>
      </div>

      <div style="padding: 20px; background: white;">
        <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <h3 style="margin-top: 0; color: #92400e;">⏰ URGENTNÍ - NOVÁ OBJEDNÁVKA</h3>
          <p><strong>Celková cena:</strong> ${order.totalPrice} Kč</p>
          <p><strong>Typ:</strong> ${order.orderType === 'delivery' ? '🚚 ROZVOZ' : '🏃 VYZVEDNUTÍ'}</p>
          <p><strong>Čas objednání:</strong> ${new Date(order.createdAt).toLocaleString('cs-CZ')}</p>
        </div>

        <h3>👤 Zákazník:</h3>
        <p><strong>Jméno:</strong> ${order.customerInfo.name}</p>
        <p><strong>Telefon:</strong> <a href="tel:${order.customerInfo.phone}">${order.customerInfo.phone}</a></p>
        ${order.customerInfo.email ? `<p><strong>Email:</strong> ${order.customerInfo.email}</p>` : ''}
        ${order.orderType === 'delivery' ? `<p><strong>Adresa:</strong> ${order.customerInfo.address}, ${order.customerInfo.city}</p>` : ''}

        <h3>🍕 Položky:</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
          ${itemsList}
        </div>

        ${order.customerInfo.notes ? `<h3>💬 Poznámka:</h3><p style="background: #fef3c7; padding: 10px; border-radius: 5px;">${order.customerInfo.notes}</p>` : ''}

        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:3000/admin/orders" 
             style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            📋 Spravovat objednávky
          </a>
        </div>
      </div>
    </div>
    `;
  }

  // TEMPLATE PRO REZERVACI
  getReservationTemplate(reservation) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🍕 Pizza Fresca</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Potvrzení rezervace stolu</p>
      </div>

      <div style="padding: 30px;">
        <h2 style="color: #2d3748; margin-top: 0;">Vaše rezervace je potvrzena!</h2>
        
        <div style="background: #f0f8ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4a5568;">📅 Detail rezervace</h3>
          <p><strong>Datum:</strong> ${new Date(reservation.date).toLocaleDateString('cs-CZ')}</p>
          <p><strong>Čas:</strong> ${reservation.time}</p>
          <p><strong>Počet osob:</strong> ${reservation.guests}</p>
          <p><strong>Jméno:</strong> ${reservation.name}</p>
          <p><strong>Telefon:</strong> ${reservation.phone}</p>
          ${reservation.notes ? `<p><strong>Poznámka:</strong> ${reservation.notes}</p>` : ''}
        </div>

        <div style="background: #e6fffa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #065f46;">📍 Kde nás najdete</h4>
          <p style="margin: 5px 0;"><strong>Adresa:</strong> Hany Kvapilové 19, Praha 4</p>
          <p style="margin: 5px 0;"><strong>Telefon:</strong> 722 272 252</p>
          <p style="margin: 5px 0;"><strong>Otevírací doba:</strong> Po-So 17:00-20:30</p>
        </div>

        <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
          Těšíme se na vaši návštěvu! 🍕<br>
          Pokud potřebujete rezervaci změnit, zavolejte nám na 722 272 252
        </p>
      </div>
    </div>
    `;
  }

  // TEMPLATE PRO STATUS UPDATE
  getStatusUpdateTemplate(order, status, message) {
    const statusIcons = {
      'confirmed': '✅',
      'preparing': '👨‍🍳',
      'ready': '🍕',
      'delivered': '🚚',
      'cancelled': '❌'
    };

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
      <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">${statusIcons[status]} Aktualizace objednávky</h1>
        <p style="margin: 10px 0 0;">Pizza Fresca - Objednávka #${order.orderNumber}</p>
      </div>

      <div style="padding: 30px;">
        <h2 style="color: #2d3748; margin-top: 0;">${message}</h2>
        
        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p><strong>Celková cena:</strong> ${order.totalPrice} Kč</p>
          <p><strong>Typ:</strong> ${order.orderType === 'delivery' ? '🚚 Rozvoz' : '🏃 Vyzvednutí'}</p>
        </div>

        <p style="color: #718096; font-size: 14px; text-align: center;">
          Máte dotazy? Zavolejte nám na <a href="tel:722272252">722 272 252</a>
        </p>
      </div>
    </div>
    `;
  }
}

module.exports = new EmailService();