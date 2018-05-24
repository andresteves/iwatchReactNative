//
//  InterfaceController.swift
//  watchapp Extension
//
//  Created by Andre Esteves on 24/05/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import WatchKit
import WatchConnectivity
import Foundation
import CoreLocation

class InterfaceController: WKInterfaceController, WCSessionDelegate, CLLocationManagerDelegate {

    @IBOutlet var image: WKInterfaceImage!
    @IBOutlet var label: WKInterfaceLabel!
    
    var isRequestingLocation: Bool = true
    var currentLocation: CLLocationCoordinate2D!
    var manager: CLLocationManager!
    var session: WCSession!
    
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
      
        if WCSession.isSupported() {
          print("Activating watch session")
          self.session = WCSession.default
          self.session.delegate = self
          self.session.activate()
          
          manager = CLLocationManager.init()
          manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
          manager.distanceFilter = 10.0  // In meters.
          manager.delegate = self
          
          requestLocation()
        }
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

  ////////////////////////////////////////////////////////////////////////////////
  
  
  
  func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
    print("watch received message", message);
    let text = message["text"] as! String
    let timestamp : Double = (message["timestamp"] as! NSNumber).doubleValue
    self.label.setText(text)
    let currentTimestamp: Double = Date().timeIntervalSince1970 * 1000
    let elapsed : Double = currentTimestamp - timestamp
    replyHandler(["elapsed":Int(elapsed), "timestamp": round(currentTimestamp)])
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  
  
  func session(_ session: WCSession, didReceiveMessageData messageData: Data, replyHandler: @escaping (Data) -> Void) {
    let currentTimestamp: Double = Date().timeIntervalSince1970 * 1000
    let decodedData = Data(base64Encoded: messageData, options: NSData.Base64DecodingOptions(rawValue: 0))
    self.image.setImageData(decodedData)
    let json : String = JSONStringify(["currentTimestamp": currentTimestamp])
    let data : Data = json.data(using: String.Encoding.utf8)!
    replyHandler(data)
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Start requesting location
   */
  func requestLocation() {

    let authorizationStatus = CLLocationManager.authorizationStatus()
    
    switch authorizationStatus {
      case .notDetermined:
        print("notDetermined")
        isRequestingLocation = true
        manager.requestWhenInUseAuthorization()
      case .authorizedWhenInUse, .authorizedAlways:
        print("authorizedWhenInUse")
        isRequestingLocation = true
        manager.startUpdatingLocation()
      case .denied:
        print("denied location")
      case .restricted:
        print("restricted location")
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  // MARK: Location Delegate methods
  
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    
    guard !locations.isEmpty else { return }
    
    DispatchQueue.main.async {
      self.currentLocation = locations.last!.coordinate
      
      if self.session?.activationState == WCSessionActivationState.activated
      {
        self.session.sendMessage(["latitude":self.currentLocation.latitude, "longitude":self.currentLocation.longitude], replyHandler: nil, errorHandler: nil)
      }
    }
  }
  
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    DispatchQueue.main.async {
      print(error.localizedDescription)
      self.currentLocation = nil
    }
  }
  
  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    DispatchQueue.main.async {
      guard self.isRequestingLocation else { return }
      
      switch status {
      case .authorizedWhenInUse:
        manager.requestLocation()
        
      case .denied:
        print("Auth Denied")
        self.currentLocation = nil
        
      default:
        print("Auth Default")
        self.currentLocation = nil
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  
  func session(_ session: WCSession, didReceive file: WCSessionFile) {
    let data: Data? = try? Data(contentsOf: file.fileURL)
    self.image.setImageData(data)
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
    print("did receive application context", applicationContext)
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any]) {
    //unused
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  func session(_ session: WCSession, didFinish fileTransfer: WCSessionFileTransfer, error: Error?) {
    // Unused
  }
  
  func session(_ session: WCSession, didFinish userInfoTransfer: WCSessionUserInfoTransfer, error: Error?) {
    // Unused
  }
  
  func sessionReachabilityDidChange(_ session: WCSession) {
    // Unused
  }
  
  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    // Unused
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  
  func JSONStringify(_ value: Dictionary<String, Any>, prettyPrinted:Bool = false) -> String{
    let options = prettyPrinted ? JSONSerialization.WritingOptions.prettyPrinted : JSONSerialization.WritingOptions(rawValue: 0)
    
    if JSONSerialization.isValidJSONObject(value) {
      
      do{
        let data = try JSONSerialization.data(withJSONObject: value, options: options)
        if let string = NSString(data: data, encoding: String.Encoding.utf8.rawValue) {
          return string as String
        }
      }
      catch {
        print("error")
      }
      
    }
    return ""
  }
}
