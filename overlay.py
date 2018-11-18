import os
from PIL import Image, ImageDraw, ImageFont
import json
import sys
import functools
import numpy as np
import cv2

#Note: Change backslashes to normal slashes
dataDictionary = {} #order = x_start, y_start, width, height, text
with open(os.getcwd()+'/'+sys.argv[1], encoding="utf8") as json_file:
	data = json.load(json_file)
	for f in data:
		for g in data[f]:
			dataDictionary.update({f: []})
			dataDictionary[f].append(min(g['topleft']['x'], g['bottomleft']['x']))
			dataDictionary[f].append(min(g['topleft']['y'], g['bottomleft']['y']))
			dataDictionary[f].append(abs(g['topright']['x'] - g['topleft']['x']))
			dataDictionary[f].append(abs(g['bottomright']['y'] - g['topright']['y']))
			dataDictionary[f].append(g['line'])
		#print(dataDictionary[f])

print("data read")
cap = cv2.VideoCapture(sys.argv[2])
fourcc = cv2.VideoWriter_fourcc(*'avc1')
src_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
src_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
src_fps = cap.get(cv2.CAP_PROP_FPS)
size = src_width, src_height
out = cv2.VideoWriter('output.mp4', fourcc, src_fps, size)
while(cap.isOpened()):
	current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
	ret, frame = cap.read()
	if ret == True:
		if str(current_frame) in data:
			for fr in data[str(current_frame)]:
			#print("test")
				font = cv2.FONT_HERSHEY_SIMPLEX
				bottomLeftCornerOfText = (fr["bottomleft"]["x"], fr["bottomleft"]["y"])
				fontScale = 1
				fontColor = (0, 0, 0)
				lineType = 2
				cv2.putText(frame, fr["line"],
							bottomLeftCornerOfText,
							font,
							fontScale,
							fontColor,
							lineType)
		# create and overlay text

		out.write(frame)
	else:
		break

cap.release()
out.release()
cv2.destroyAllWindows()
#check if frame exists, if not, go all the way to the previous 1 frames, if still no existence, then leave
