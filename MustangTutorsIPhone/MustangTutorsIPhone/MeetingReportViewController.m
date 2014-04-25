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
#import "LoginViewController.h"
@interface MeetingReportViewController ()
@property (weak, nonatomic) IBOutlet UITextField *smuIdField;
@property (weak, nonatomic) IBOutlet UILabel *warningMessage;
@end

@implementation MeetingReportViewController

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
        // Make sure your segue name in storyboard is the same as this line
        if ([[segue identifier] isEqualToString:@"segueToMeetingCourse"])
        {
            [self.meetingDocument setSmuId:[[self.smuIdField text]integerValue]];

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
    
    NSDictionary *dic = [NSDictionary dictionaryWithObjectsAndKeys:[UIColor colorWithRed:0 green:.62 blue:.984 alpha:1],NSForegroundColorAttributeName,nil];
    
    [self.navigationController.navigationBar setTitleTextAttributes:dic];

    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;

    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(dismissKeyboard)];
    
    [self.view addGestureRecognizer:tap];

}
-(void)dismissKeyboard {
    if(![[self.smuIdField text]isEqualToString:@""])
    {
        [self.warningMessage setHidden:YES];
    }
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
- (IBAction)logoutButton:(UIButton *)sender
{
        LoginViewController * vc = [self.storyboard instantiateViewControllerWithIdentifier:@"loginViewController"];
        UIStoryboardSegue * logoutSegue = [UIStoryboardSegue segueWithIdentifier:@"logoutSegue" source:self destination:vc performHandler:^{
            NSLog(@"ballsack");
            
        }];
        


}

- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender
{
    if(![identifier isEqualToString: @"logoutSegue"]){
        if([[self.smuIdField text]isEqualToString:@""])
        {
            [self.warningMessage setHidden:NO];
            return NO;
        }else{
            [self.warningMessage setHidden:YES];
            return YES;
        }
    }else return YES;
}
-(void)viewDidAppear:(BOOL)animated
{
    
    [self.smuIdField setText:@""];
}

@end
