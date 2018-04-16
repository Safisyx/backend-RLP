import * as multer from 'koa-multer'

export const fileUploadOptions = () => {
  multer.diskStorage({

        destination: (req: any, file: any, cb: any) => { cb(null, 'public/upload')
        },
        filename: (req: any, file: any, cb: any) => { cb(null, file.fieldname + '-' + new Date().
        toISOString().split('.')[0] + '.' + file.originalname.split('.')[1])
        }
    })
  }

  export const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false)
    }
  }
    // limits: {
    //     fieldNameSize: 255,
    //     fileSize: 1024 * 1024 * 2
    // }
