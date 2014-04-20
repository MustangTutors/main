//
//  TutorHoursViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/14/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Tutor.h"
@interface TutorHoursViewController : UIViewController <UITableViewDelegate,UITableViewDataSource>
@property(strong,nonatomic)Tutor * tutor;
@property (weak, nonatomic) IBOutlet UITableView *ScheduleTableView;
@end
