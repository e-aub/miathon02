import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert, PermissionsAndroid, Platform, TouchableOpacity, Text } from 'react-native';
import { launchCamera, launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';

const PhotoScreen: React.FC = () => {
  const [photo, setPhoto] = useState<Asset | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissions();
    }
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      const storageGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'This app needs access to your storage to save photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (cameraGranted !== PermissionsAndroid.RESULTS.GRANTED || storageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permissions not granted');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setPhoto(response.assets ? response.assets[0] : null);
      }
    });
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setPhoto(response.assets ? response.assets[0] : null);
      }
    });
  };

  const uploadImage = async () => {
    if (!photo) {
      Alert.alert('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName,
    });

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleCamera}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGallery}>
        <Text style={styles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
      <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={uploadImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f9ff',
    padding: 20,
  },
  button: {
    backgroundColor: '#2562ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#f1f9ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    borderColor: '#14967f',
    borderWidth: 2,
  },
  uploadButton: {
    backgroundColor: '#14967f',
  },
});

export default PhotoScreen;
