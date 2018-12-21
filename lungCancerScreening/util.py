from ConfigParser import SafeConfigParser
import os

config = SafeConfigParser()
config_file = os.environ.get('LCS_CONFIG_FILE', 'config.ini')
config.read(config_file)

ADMIN_EMAIL = config.get('email', 'admin_email')
SUPPORT_EMAIL = config.get('email', 'support_email')

PDF_FILE_NAME = config.get('export', 'pdf_file_name')

CLIENT_FOLDER = config.get('client', 'folder')
CLIENT_APP_FOLDER = os.path.join(os.environ['PWD'], CLIENT_FOLDER, config.get('client', 'app_folder'))
