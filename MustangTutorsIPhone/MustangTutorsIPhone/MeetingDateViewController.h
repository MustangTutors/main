//
//  MeetingDateViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Meeting.h"
#import "Tutor.h"
@interface MeetingDateViewController : UIViewController
@property(nonatomic,strong)Meeting * meetingDocument;
@property (weak, nonatomic) IBOutlet UIDatePicker *startTimePicker;
@property (weak, nonatomic) IBOutlet UIDatePicker *meetingDatePicker;
@property (weak, nonatomic) IBOutlet UIDatePicker *endTimePicker;

-(IBAction)startTimePressed:(id)sender;
-(IBAction)endTimePressed:(id)sender;
-(IBAction)datePressed:(id)sender;
@property(nonatomic,strong)Tutor * tutor;
@end
