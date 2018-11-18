import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import json
import sys
import functools
import numpy as np
import cv2

#Note: Change backslashes to normal slashes
dataDictionary = {} #order = x_start, y_start, width, height, text
with open(os.getcwd()+'/'+sys.argv[1], encoding="utf-8") as json_file:
	data = json.load(json_file)

print(data)
cap = cv2.VideoCapture(sys.argv[2])
fourcc = cv2.VideoWriter_fourcc(*'avc1')
src_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
src_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
src_fps = cap.get(cv2.CAP_PROP_FPS)
size = src_width, src_height
out = cv2.VideoWriter('output.mp4', fourcc, src_fps, size)


font_size=36
back_ground_color=(255,255,255)
font_size=36
font_color=(0,0,0)
unicode_font = ImageFont.truetype("arial.ttf", font_size)



while(cap.isOpened()):
	current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
	ret, frame = cap.read()
	if ret == True:
		frameToCheck = current_frame
		if str(current_frame - 1) in data:
				frameToCheck -= 1
		if str(current_frame) in data:
			img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
			im  =  Image.fromarray(img)
			for fr in data[str(frameToCheck)]:
			#print("test")
				font = cv2.FONT_HERSHEY_SIMPLEX
				bottomLeftCornerOfText = (fr["bottomleft"]["x"], fr["bottomleft"]["y"])
				fontScale = 1
				fontColor = (0, 0, 0)
				lineType = 2

				draw  =  ImageDraw.Draw (im)				
				#draw.rectangle([(fr["bottomleft"]["x"], fr["bottomleft"]["y"]), (fr["topright"]["x"], fr["topright"]["y"])], fill=(255,255,255))

				draw.text ( bottomLeftCornerOfText, fr["line"], font=unicode_font, fill=font_color)


				#cv2.putText(frame, fr["line"],
				#			bottomLeftCornerOfText,
				#			font,
				#			fontScale,
				#			fontColor,
				#			lineType)
			frame = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)

		# create and overlay text
		out.write(frame)


		
	else:
		break

cap.release()
out.release()
cv2.destroyAllWindows()
#check if frame exists, if not, go all the way to the previous 1 frames, if still no existence, then leave
