from ConfigParser import SafeConfigParser
import os
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from base64 import b64decode

config = SafeConfigParser()
config_file = os.environ.get('LCS_CONFIG_FILE', 'config.ini')
config.read(config_file)

ADMIN_EMAIL = config.get('email', 'admin_email')
SUPPORT_EMAIL = config.get('email', 'support_email')
REPORT_URL = config.get('email', 'report_url')
SENDER_EMAIL = config.get('email', 'sender_email')
TITLE = config.get('export', 'title')

PDF_FILE_NAME = config.get('export', 'pdf_file_name')
PDF_TITLE = config.get('export', 'title')

CLIENT_APP_FOLDER = os.path.join(os.environ['PWD'], config.get('client', 'app_folder'))

def send_mail(sender, recipient, subject, contents, attachments=None):
    """Sends an email to the provided recipient

    Arguments:
        - sender {string} -- The sender of the email
        - recipient {string} -- The recipient of the email, can be ',' separated if multiple recipient
        - subject {string} -- The email's subject
        - contents {string} -- The email's contents

    Keyword Arguments:
        - attachments {string[]} -- Filenames of attachments (default: {None})
    """
    server = None
    try:
        message = MIMEMultipart()
        message['Subject'] = subject
        message['From'] = sender
        message['To'] = recipient

        # set text for message
        contents = contents if type(contents) is str else contents.encode('utf-8')
        message.attach(MIMEText(contents, 'html', 'utf-8'))

        # add attachments to message
        if attachments is not None:
            for attachment in attachments:
                with open(attachment, 'rb') as _file:
                    message.attach(MIMEApplication(
                        _file.read(),
                        Name=os.path.basename(attachment)
                    ))
        host = config.get('email', 'host')
        # send email
        server = smtplib.SMTP(host)
        server.sendmail(sender, recipient.split(','), message.as_string())
        return True
    except Exception as e:
        print(e)
        return False
    finally:
        if server and getattr(server, 'quit'):
            server.quit()

def saveImages(images):
    print(images)
    for img in images:
        if 'data' in img and 'name' in img:
            filename = img['name']
            print(filename)
            data = img['data']
            print(data)
            with open('tmp/' + filename, 'w') as ofile:
                ofile.write(b64decode(data))
