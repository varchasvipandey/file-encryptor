# File Encryptor

File Encryptor makes storing secret files on the GitHub secure. The action can perform both encryption and decryption process making it possible for the developers to encrypt a file while pushing the code and decrypt the on pull.

## Required Input Arguments

|Argument     |Values/Type    |Description     |
|:----|:----|:----|
|input-file-path   | string | Path of the file relative to your workflow directory. |
|encrypt-secret     |string(16)     |A 16 character long secret is required. Refer your secret from your repositories secrets on GitHub.    |
|mode     | "encryption" \|  "decryption" | Determines whether the file will get encrypted or decrypted |

## How it works

To make the process simple and real-world requirement friendly, File Encryptor encrypts the data of a file and updates the same file only. This action was made keeping mind the encryption process for an environment file which developers usually mention in the repositories Git Ignore file (.gitignore).

## Usage Example

Do check action.yml file of this action repository.

```yaml
steps:
  -	uses: varchasvipandey/file-encryptor@1.0.0
  	with:
  		input-file-path: '../../.env'
  		encrypt-secret: ${{ secrets.FILE_ENCRYPTOR_SECRET }}
  		mode: 'encryption'
```

