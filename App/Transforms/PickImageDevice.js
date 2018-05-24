import ImagePicker from 'react-native-image-picker'

// MessageData API is not intended for large images and so we need to restrict the size
const MAX_IMAGE_SIZE = 300

export function pickImage (title, data = false) {
  const xtra = data ? {maxWidth: MAX_IMAGE_SIZE, maxHeight: MAX_IMAGE_SIZE} : {}
  return new Promise((resolve, reject) => {
    const options = {
      title:                        title,
      cancelButtonTitle:            'Cancel',
      takePhotoButtonTitle:         'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      cameraType:                   'front',
      mediaType:                    'photo',
      quality:                      0.5,
      allowsEditing:                true,
      noData:                       !data,
      storageOptions:               {
        skipBackup: true,
        path:       'images'
      },
      ...xtra
    }

    ImagePicker.showImagePicker(options, response => {
      const {error} = response
      if (response.didCancel) {
        // Do nothing
      }
      else if (error) {
        reject(error)
      }
      else {
        if (data && response.data) {
          let dataUri      = 'data:image/jpeg;base64,' + response.data
          response.dataUri = dataUri
        }
        resolve(response)
      }
    });
  })
}