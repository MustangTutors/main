//
//  MeetingReportViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "MeetingReportViewController.h"
#import "MeetingCourseViewController.h"
#import "TabBarViewController.h"
@interface MeetingReportViewController ()
@property (weak, nonatomic) IBOutlet UITextField *smuIdField;
@end

@implementation MeetingReportViewController
- (IBAction)goToCourseChoice:(UIBarButtonItem *)sender {
}

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    NSLog(@"%d",[self.meetingDocument getSmuId]);

    // Make sure your segue name in storyboard is the same as this line
    if ([[segue identifier] isEqualToString:@"segueToMeetingCourse"])
    {
        [self.meetingDocument setSmuId:[[self.smuIdField text]integerValue]];

        NSLog(@"%d",[self.meetingDocument getSmuId]);

        // Get reference to the destination view controller
        MeetingCourseViewController * vc = (MeetingCourseViewController *)[segue destinationViewController];
        
        // Pass any objects to the view controller here, like...
        [vc setMeetingDocument:self.meetingDocument];
        vc.tutor = self.tutor;
        
    }
    

}



- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    self.meetingDocument = [[Meeting alloc]init];
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;

    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(dismissKeyboard)];
    
    [self.view addGestureRecognizer:tap];

}
-(void)dismissKeyboard {
    [self.smuIdField resignFirstResponder];
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
