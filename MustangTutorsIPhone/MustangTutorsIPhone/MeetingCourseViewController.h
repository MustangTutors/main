//
//  MeetingCourseViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Meeting.h"
#import "Tutor.h"
@interface MeetingCourseViewController : UIViewController
@property (weak, nonatomic) IBOutlet UIPickerView *coursePickerView;
@property(nonatomic,strong)Meeting * meetingDocument;
@property(nonatomic,strong)Tutor * tutor;
@end
