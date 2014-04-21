//
//  MeetingCommentViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "MeetingCommentViewController.h"
@interface MeetingCommentViewController ()
@property (weak, nonatomic) IBOutlet UITextView *commentTextView;
@property (weak, nonatomic) IBOutlet UILabel *warningLabel;

@end

@implementation MeetingCommentViewController

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if([segue.identifier isEqualToString:@"segueMeetingToProfile"])
    {
            
    }
}
- (IBAction)submitMeeting:(UIButton *)sender {
    if(![[self.commentTextView text]isEqualToString:@"Your Summary Goes Here"])
    {
        [self.warningLabel setHidden:YES];
        [self.meetingDocument setComment:[self.commentTextView text]];
    
        //add new meeting report
    
        // Initialize Session Manager
        AFHTTPSessionManager * manager = [[AFHTTPSessionManager alloc]initWithBaseURL:[NSURL URLWithString:@"http://local.mustangtutors.com"]];
    
        // Configure Manager
        AFJSONResponseSerializer * serializer = [AFJSONResponseSerializer serializer];
        NSMutableSet * set = [NSMutableSet setWithSet:serializer.acceptableContentTypes];
        [set addObject:@"text/html"];
        [serializer setAcceptableContentTypes:set];
        [manager setResponseSerializer:serializer];
    
        //create post data dictionary
        NSMutableDictionary * post_meeting = [[NSMutableDictionary alloc]
                                          init];
        //store smu id and course id of student tutored and course tutored
        [post_meeting setObject:[NSString stringWithFormat:@"%d",[self.meetingDocument getSmuId]] forKey:@"student_id"];
        [post_meeting setObject:[NSString stringWithFormat:@"%d",[self.meetingDocument getCourseId]] forKey:@"course_id"];

        //format date format to match sequel pro DATE type
        NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"yyyy-MM-dd"];
        [post_meeting setObject:[formatter stringFromDate:[self.meetingDocument date]] forKey:@"day"];
    
        //format start_time and end_time format to match SQLPRO TIME type
        [formatter setDateFormat:@"HH:mm:ss"];
        [post_meeting setObject: [formatter stringFromDate:[self.meetingDocument startTime]] forKey:@"start_time"];
        [post_meeting setObject:[formatter stringFromDate:[self.meetingDocument endTime]] forKey:@"end_time"];
    
        //store summary of meeting
        [post_meeting setObject:[self.commentTextView text] forKey:@"summary"];

        //make post request
        [manager POST:[NSString stringWithFormat:@"/Laravel/public/iphone/tutors/addMeeting/%d",[self.tutor getUserId]] parameters:post_meeting success:^(NSURLSessionDataTask *task, id responseObject) {
            //success nslog the respone from server
            NSLog(@"JSON:%@",responseObject);
        } failure:^(NSURLSessionDataTask *task, NSError *error) {
            NSLog(@"%@", task.response);
            NSLog(@"%@", error);

        }];

        [self performSelector:@selector(patchSelector) withObject:nil afterDelay:1];

        UIAlertView * successMessage = [[UIAlertView alloc] initWithTitle:nil message:@"Report Successfully Documented" delegate:self cancelButtonTitle:nil otherButtonTitles:nil];
        [successMessage show];
        [self timedAlert:successMessage];
    }else
    {
        [self.warningLabel setHidden:NO];
    }

}
-(void)timedAlert:(UIAlertView *)alert
{
    [self performSelector:@selector(dismissAlert:) withObject:alert afterDelay:2];
}

-(void)dismissAlert:(UIAlertView *) alertView
{
    [alertView dismissWithClickedButtonIndex:nil animated:YES];
}

-(void)patchSelector{
    [self.navigationController popToRootViewControllerAnimated:YES];
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
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(dismissKeyboard)];
    
    [self.view addGestureRecognizer:tap];
    
}
-(void)dismissKeyboard {
    if(![[self.commentTextView text]isEqualToString:@"Your Summary Goes Here"])
    {
        [self.warningLabel setHidden:YES];
    }
    [self.commentTextView resignFirstResponder];
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

#define kOFFSET_FOR_KEYBOARD 100.0

-(void)keyboardWillShow {
    // Animate the current view out of the way
    if (self.view.frame.origin.y >= 0)
    {
        [self setViewMovedUp:YES];
    }
    else if (self.view.frame.origin.y < 0)
    {
        [self setViewMovedUp:NO];
    }
}

-(void)keyboardWillHide {
    if (self.view.frame.origin.y >= 0)
    {
        [self setViewMovedUp:YES];
    }
    else if (self.view.frame.origin.y < 0)
    {
        [self setViewMovedUp:NO];
    }
}

-(void)textFieldDidBeginEditing:(UITextField *)sender
{
    if ([sender isEqual:self.commentTextView])
    {
        //move the main view, so that the keyboard does not hide it.
        if  (self.view.frame.origin.y >= 0)
        {
            [self setViewMovedUp:YES];
        }
    }
}

//method to move the view up/down whenever the keyboard is shown/dismissed
-(void)setViewMovedUp:(BOOL)movedUp
{
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.3]; // if you want to slide up the view
    
    CGRect rect = self.view.frame;
    if (movedUp)
    {
        // 1. move the view's origin up so that the text field that will be hidden come above the keyboard
        // 2. increase the size of the view so that the area behind the keyboard is covered up.
        rect.origin.y -= kOFFSET_FOR_KEYBOARD;
        rect.size.height += kOFFSET_FOR_KEYBOARD;
    }
    else
    {
        // revert back to the normal state.
        rect.origin.y += kOFFSET_FOR_KEYBOARD;
        rect.size.height -= kOFFSET_FOR_KEYBOARD;
    }
    self.view.frame = rect;
    
    [UIView commitAnimations];
}

- (void)viewWillAppear:(BOOL)animated
{
    // register for keyboard notifications
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    // unregister for keyboard notifications while not visible.
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillShowNotification
                                                  object:nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIKeyboardWillHideNotification
                                                  object:nil];
}

@end
