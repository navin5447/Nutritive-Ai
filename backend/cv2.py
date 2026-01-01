# Mock OpenCV module for demo purposes
# This allows the backend to start without requiring OpenCV compilation
import numpy as np

# Mock constants
IMREAD_COLOR = 1
COLOR_BGR2RGB = 4
COLOR_BGR2HSV = 40
COLOR_BGR2LAB = 44
HOUGH_GRADIENT = 3

# Mock classes and functions
class Error(Exception):
    pass

def imread(filename, flags=None):
    """Mock image read - returns a placeholder numpy array"""
    return np.zeros((480, 640, 3), dtype=np.uint8)

def resize(src, dsize, interpolation=None):
    """Mock resize - returns resized array"""
    return np.zeros((*dsize[::-1], 3), dtype=np.uint8) if len(dsize) == 2 else np.zeros(dsize, dtype=np.uint8)

def cvtColor(src, code):
    """Mock color conversion"""
    return src.copy()

def GaussianBlur(src, ksize, sigmaX):
    """Mock Gaussian blur"""
    return src.copy()

def HoughCircles(image, method, dp, minDist, param1=None, param2=None, minRadius=None, maxRadius=None):
    """Mock circle detection - returns None (no circles found)"""
    return None

def imdecode(buf, flags):
    """Mock image decode from buffer"""
    return np.zeros((480, 640, 3), dtype=np.uint8)

def imencode(ext, img):
    """Mock image encode"""
    return (True, np.array([]))

# Mock submodules
class dnn:
    @staticmethod
    def readNetFromCaffe(prototxt, caffemodel):
        return None
    
    @staticmethod
    def blobFromImage(image, scalefactor=1.0, size=(300, 300), mean=(104, 117, 123), swapRB=False):
        return np.zeros((1, 3, 300, 300))

print("Warning: Using mock cv2 module. For production, install OpenCV with: pip install opencv-python")
