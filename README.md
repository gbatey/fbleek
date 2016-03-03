# FBLA + Sleek = FBLEEK!

FBLEEK is a fashion app for FBLA members to share their outfits and ask questions on thier posted outfit.

It was developed to run on IOS using Apple's IDE (Integrated Development Environment) XCode and Meteor, a javascript framework that can bundle IOS apps.

Source code is available on [GitHub](https://github.com/gbatey/fbleek).

## What you need

* an IPhone (or run it in the simulator)
* an Apple mac
* XCode -- download it [here](https://developer.apple.com/xcode/download/)
* [Meteor](https://www.meteor.com) -- install it with this command:

```
curl https://install.meteor.com/ | sh
```

## How to run it in a browser

Because Meteor uses web technologies like HTML, CSS, and Javascript, most of the developement was with the [Atom](https://atom.io/) editor and a browser.

1. Open terminal
2. Change to the source code directory (where this README.md file is)

    ```
    cd FBLEEK
    ```
   
3. Run Meteor with this command:

    ```
    run meteor
    ```

## How to run it in the simulator

1. Open terminal
2. Change to the source code directory
3. Run meteor with this command

```
meteor run ios
```

**Note** _the camera function does not work in the simulator, you have to follow the instructions to load it on your phone._

## How to load it on your phone

[These](https://github.com/meteor/meteor/wiki/How-to-run-your-app-on-an-iOS-device) instructions show how.

```
meteor run ios-device
```
* On phone: Settings > General > Device Management > *developer_id*
* Make sure your phone is on the same wireless network as the computer 

## What does the app do?

After you register you get four buttons at the bottom of the screen.

1. The first button is a 'Home' panel that displays pictures that people have posted.
2. The second button is a 'Search' panel that finds posted outfits by a question or username.
3. The third button takes a picture and then asks the user to enter a question.
4. The fourth button logs the user out.

You can click on any posted outfit to add a comment and see the other comments.

## How does the app work?

Meteor runs a local server that connects to a Mongo database. The database stores user logins, the posted outfits, and comments.

When the user takes a picture it is stored on Amazon S3, a file server in the cloud.

The Javascript in the client asks the server for data and puts it in the HTML templates.

## What's left todo?

1. User Profiles - it would be cool to have the user pick an avatar or take a picture that would be shown next to their posts and comments.
2. When the user registers, the password should should check that the verify-password matches.
3. It would be nice if the user could recover their password.