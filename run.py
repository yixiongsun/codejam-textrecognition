#dependencies: ffmpeg, neural-enhance, motion-stab., contrast adjustments
import sys
import os
import ffmpeg
import subprocess
import base64
import cv2
import json
import re
#command: ffmpeg -i blah.mp4 -vf select='between(n\,100\,200)' -vsync 0 -frame_pts 1 frame%d.png
#command: ffmpeg -i blah.mp4 -vf select=1 -vsync 0 -frame_pts 1 frame%d.png

def emptyFolder(path):
    for file_object in os.listdir(path):
        file_object_path = os.path.join(path, file_object)
        if os.path.isfile(file_object_path):
            os.unlink(file_object_path)
        else:
            shutil.rmtree(file_object_path)

def printBase64(path):
    for filename in os.listdir(path):
        if not filename.startswith('.'):
            with open(path+'/'+filename, "rb") as image_file:
                frame_number = re.search(r'\d+', filename).group()  # some parsing stuff
                encoded_string = base64.b64encode(image_file.read())
                encoded_string = str(encoded_string)[2:-1]
                x = '{{ "frame": "{}", "image":"{}"}}'.format(frame_number, encoded_string)
                y = json.loads(x)
                print(json.dumps(y))

input = sys.argv[1]
#Get video frame count aka length
cap = cv2.VideoCapture(input)
length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

frame_interval = 2
length = 200
for i in range(0, length, frame_interval):
    if(length-1 < i+frame_interval):
        subprocess.call(['ffmpeg', '-i', input, '-vf', 'select=\'between(n\,{}\,{})\''.format(i, length-1), '-vsync', '0', '-frame_pts', '1', 'images/frame%d.png'])
    else:
        subprocess.call(['ffmpeg', '-i', input, '-vf', 'select=\'between(n\,{}\,{})\''.format(i, i+frame_interval), '-vsync', '0','-frame_pts', '1', 'images/frame%d.png'])
    printBase64(os.getcwd()+'/images')
    emptyFolder(os.getcwd()+'/images')
#subprocess.call(['ffmpeg', '-i', input, '-vf', 'select=1', '-vsync', '0', '-frame_pts', '1', 'images\\frame%d.png'])
#emptyFolder(os.getcwd()+'\\images')