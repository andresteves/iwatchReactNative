//
//  RoutesInterfaceController.swift
//  watchapp Extension
//
//  Created by Andre Esteves on 29/05/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import WatchKit
import Foundation
import CoreLocation


class RoutesInterfaceController: WKInterfaceController {
  
  @IBOutlet var interfaceMap: WKInterfaceMap!
  
  
  override func awake(withContext context: Any?) {
    super.awake(withContext: context)
    
    let routeDic = context as! Dictionary<String,CLLocation>
    
    let coordinateSpan = MKCoordinateSpanMake(0.01, 0.01)
    
    self.interfaceMap.addAnnotation((routeDic["start"]?.coordinate)!, with: WKInterfaceMapPinColor.green)
    self.interfaceMap.addAnnotation((routeDic["end"]?.coordinate)!, with: WKInterfaceMapPinColor.red)
    
    self.interfaceMap.setRegion(MKCoordinateRegionMake((routeDic["start"]?.coordinate)!, coordinateSpan))
    
  }
  
  override func willActivate() {
    // This method is called when watch view controller is about to be visible to user
    super.willActivate()
  }
  
  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }
  
}
