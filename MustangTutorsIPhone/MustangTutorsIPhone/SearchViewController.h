//
//  SearchViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Search.h"
#import "TutorArray.h"
@interface SearchViewController : UIViewController<UIPickerViewDataSource, UIPickerViewDelegate>
@property (strong,nonatomic)NSMutableArray * subjects;
@property (strong,nonatomic)Search * search;
@property (strong,nonatomic)TutorArray * tutorResults;
@end
