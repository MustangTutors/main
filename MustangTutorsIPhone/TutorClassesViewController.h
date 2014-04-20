//
//  TutorClassesViewController.h
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/15/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Tutor.h"
@interface TutorClassesViewController : UIViewController <UITableViewDelegate,UITableViewDataSource>
@property(nonatomic,strong)Tutor * tutor;
@property (weak, nonatomic) IBOutlet UITableView *tutorClassesTableView;
@end
