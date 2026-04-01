import json
import os
import psycopg2
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def send_email_to_admin(name: str, phone: str, address: str, area: str, message: str, lead_id: int):
    """Отправляет уведомление администратору о новой заявке."""
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    admin_email = os.environ.get('ADMIN_EMAIL', '')

    if not all([smtp_host, smtp_user, smtp_password, admin_email]):
        print('Email config missing, skipping admin email')
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'🧱 Новая заявка #{lead_id} — {name}'
    msg['From'] = smtp_user
    msg['To'] = admin_email

    rows = [
        ('Имя', name),
        ('Телефон', phone),
    ]
    if address:
        rows.append(('Адрес', address))
    if area:
        rows.append(('Площадь', f'{area} м²'))
    if message:
        rows.append(('Сообщение', message))

    table_rows_html = ''.join(
        f'<tr><td style="padding:8px 12px;font-weight:600;color:#555;white-space:nowrap">{label}</td>'
        f'<td style="padding:8px 12px;color:#222">{value}</td></tr>'
        for label, value in rows
    )

    html = f"""
    <html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px">
      <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <div style="background:#1a1a1a;padding:20px 28px">
          <h2 style="margin:0;color:#fff;font-size:18px">Новая заявка на замер</h2>
          <p style="margin:4px 0 0;color:#aaa;font-size:13px">Заявка #{lead_id}</p>
        </div>
        <div style="padding:24px 28px">
          <table style="width:100%;border-collapse:collapse">
            {table_rows_html}
          </table>
        </div>
        <div style="padding:16px 28px;background:#f9f9f9;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">Это автоматическое уведомление с сайта укладки тротуарной плитки</p>
        </div>
      </div>
    </body></html>
    """

    text_lines = [f'Новая заявка #{lead_id}', '']
    for label, value in rows:
        text_lines.append(f'{label}: {value}')
    text = '\n'.join(text_lines)

    msg.attach(MIMEText(text, 'plain', 'utf-8'))
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    ctx = ssl.create_default_context()
    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, admin_email, msg.as_string())
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls(context=ctx)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, admin_email, msg.as_string())

    print(f'Admin email sent to {admin_email}')


def handler(event: dict, context) -> dict:
    """Принимает заявку на замер тротуарной плитки, сохраняет в БД и отправляет email."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {**CORS_HEADERS, 'Access-Control-Max-Age': '86400'},
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    address = body.get('address', '').strip()
    area = body.get('area', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'})
        }

    # Сохраняем заявку в базу данных
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO t_p99294159_quantum_innovation_l.leads (name, phone, address, area, message) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (name, phone, address or None, area or None, message or None)
    )
    lead_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    # Отправляем email администратору (ошибка не блокирует ответ)
    try:
        send_email_to_admin(name, phone, address, area, message, lead_id)
    except Exception as e:
        print(f'Failed to send admin email: {e}')

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': lead_id})
    }
