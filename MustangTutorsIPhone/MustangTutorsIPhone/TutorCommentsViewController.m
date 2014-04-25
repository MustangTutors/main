//
//  TutorCommentsViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/14/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "TutorCommentsViewController.h"
#import "TabBarViewController.h"
#import "LoginViewController.h"
@interface TutorCommentsViewController ()
@property (weak, nonatomic) IBOutlet UILabel *Name_CommentsLabel;
@property (weak, nonatomic) IBOutlet UILabel *commentDateLabel;
@property (weak, nonatomic) IBOutlet UIButton *nextButton;
@property (weak, nonatomic) IBOutlet UIButton *previousButton;
@property (nonatomic)NSInteger currentComment;
@property (weak, nonatomic) IBOutlet UITextView *commentTextTextView;
@end

@implementation TutorCommentsViewController
- (IBAction)logoutButton:(UIButton *)sender
{
        LoginViewController * vc = [self.storyboard instantiateViewControllerWithIdentifier:@"loginViewController"];
        UIStoryboardSegue * logoutSegue = [UIStoryboardSegue segueWithIdentifier:@"logoutSegue" source:self destination:vc performHandler:^{
            NSLog(@"ballsack");
            
        }];
    

}
- (IBAction)nextCommentButton:(UIButton *)sender {
    [self setCurrentComment:(self.currentComment +1)];
    if((self.currentComment +1) <=[[self.tutor getComments] count])
    {
        [self setCommentInfoWithInteger:[self currentComment]];
        
        if((self.currentComment +1) ==[[self.tutor getComments] count]){
            [self.nextButton setEnabled:NO];
            [self.nextButton setTitle:@"" forState:UIControlStateDisabled];
        }
        if([self.previousButton isEnabled] == NO)
        {
            [self.previousButton setEnabled:YES];
        }
    }
}
- (IBAction)previousCommentButton:(UIButton *)sender {
    [self setCurrentComment:(self.currentComment -1)];
    if(self.currentComment >= 0)
    {
        [self setCommentInfoWithInteger:[self currentComment]];
        
        if(self.currentComment == 0){
            [self.previousButton setEnabled:NO];
            [self.previousButton setTitle:@"" forState:UIControlStateDisabled];
        }
        if([self.nextButton isEnabled] == NO)
        {
            [self.nextButton setEnabled:YES];
        }
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
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    TabBarViewController * tabBar = (TabBarViewController *)self.tabBarController;
    self.tutor = tabBar.tutor;
    [self setInitialValues];
    self.commentTextTextView.editable = NO;
}

-(void)setInitialValues
{
    [self.Name_CommentsLabel setText:[NSString stringWithFormat:@"%@'s Comments",[self.tutor getFullName]]];
    if([[self.tutor getComments] objectAtIndex:0] != NULL)
    {
        [self setCommentInfoWithInteger:0];
    }
    [self.previousButton setEnabled:NO];
    [self.previousButton setTitle:@"" forState:UIControlStateDisabled];
    [self setCurrentComment:0];
    if([[self.tutor getComments] objectAtIndex:1] == NULL)
    {
        [self.nextButton setEnabled:NO];
        [self.nextButton setTitle:@"" forState:UIControlStateDisabled];
    }


}
-(void)setCommentInfoWithInteger:(NSInteger)comNumber
{
    [self.commentTextTextView setText:[NSString stringWithFormat:@"%@",[[[self.tutor getComments] objectAtIndex:comNumber] objectForKey:@"comment" ]]];
    
    NSString * dateString = [NSString stringWithFormat:@"%@",[[[self.tutor getComments] objectAtIndex:comNumber] objectForKey:@"timeStamp"]];
    NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    
    //[formatter setTimeStyle:[NSTimeZone timeZoneForSecondsFromGMT:0]];
    NSDate * comDate = [formatter dateFromString:dateString];
    [formatter setDateFormat:@"MMM. dd, yyyy"];
    NSString * comDateString = [formatter stringFromDate:comDate];
    [formatter setDateFormat:@"h:mm a"];
    NSString * comTimeString = [formatter stringFromDate:comDate];
    [self.commentDateLabel setText:[NSString stringWithFormat:@"Date: %@ at %@",comDateString,comTimeString]];
    
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
