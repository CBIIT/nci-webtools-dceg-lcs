import argparse
from util import *

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--debug', action = 'store_true', help = 'Enables debugging')
    args = parser.parse_args()

    try:
        subject = 'PIMixture Web Traffic Report'

        content = '<p>Dear Admin,</p>'
        content += '<p>Please find {} Web Traffic Report <a href="{}" target="_blank">here.</a></p>'.format(TITLE, REPORT_URL)
        content += '<br><p>Respectfully,</p>'
        content += '<p>PIMixture Web Tool</p>'

        print('Sending PIMixture Traffic Report email to admin(s)...')
        send_mail(SENDER_EMAIL, ADMIN_EMAIL, subject, content)
        print('Traffic Report email sent.')
    except Exception as e:
        print('Send PIMixture Traffic Report email FAILED')
        print(e)