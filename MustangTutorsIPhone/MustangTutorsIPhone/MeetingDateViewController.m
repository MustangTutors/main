//
//  MeetingDateViewController.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/16/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "MeetingDateViewController.h"
#import "MeetingCommentViewController.h"

@interface MeetingDateViewController ()
@property (weak, nonatomic) IBOutlet UILabel *startLabel;
@property (weak, nonatomic) IBOutlet UILabel *dateLabel;
@property (weak, nonatomic) IBOutlet UILabel *endLabel;
@property (weak, nonatomic) IBOutlet UILabel *warningMessage;

@end

@implementation MeetingDateViewController
- (IBAction)segueToCommentsView:(UIBarButtonItem *)sender {
    [self.meetingDocument setDate:[self.meetingDatePicker date]];
    [self.meetingDocument setStartTime:[self.startTimePicker date]];
    [self.meetingDocument setEndTime:[self.endTimePicker date]];
}

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{

    // Make sure your segue name in storyboard is the same as this line
    if ([[segue identifier] isEqualToString:@"segueToMeetingComment"])
    {
        [self.meetingDocument setDate:[self.meetingDatePicker date]];
        [self.meetingDocument setStartTime:[self.startTimePicker date]];
        [self.meetingDocument setEndTime:[self.endTimePicker date]];

        // Get reference to the destination view controller
        MeetingCommentViewController * vc = (MeetingCommentViewController *)[segue destinationViewController];
        
        // Pass any objects to the view controller here, like...
        [vc setMeetingDocument:self.meetingDocument];
        vc.tutor = self.tutor;
    }

}

-(id)initWithCoder:(NSCoder *)aDecoder{
    self = [super initWithCoder:aDecoder];
    if(self) {
        
    }
    return self;
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
    self.startTimePicker.hidden = YES;
    self.startTimePicker.alpha = 0;
    self.endTimePicker.hidden = YES;
    self.endTimePicker.alpha = 0;
    self.meetingDatePicker.hidden = YES;
    self.meetingDatePicker.alpha = 0;

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

-(IBAction)startTimePressed:(id)sender{
    self.endTimePicker.hidden = YES;
    self.endTimePicker.alpha = 0;
    self.meetingDatePicker.hidden = YES;
    self.meetingDatePicker.alpha = 0;

    if(self.startTimePicker.hidden){
        [UIView animateWithDuration:1 animations:^{
            self.startTimePicker.hidden = NO;
            
            self.startTimePicker.alpha = 1;
        } completion:^(BOOL finished) {
            
        }];
    } else {
        [UIView animateWithDuration:1 animations:^{
            self.startTimePicker.alpha = 0;
        } completion:^(BOOL finished) {
            self.startTimePicker.hidden = YES;
            NSDateFormatter * df = [[NSDateFormatter alloc]init];
            [df setDateFormat:@"h:mm a"];
            [self.startLabel setText:[df stringFromDate:[self.startTimePicker date]]];
            if(![[self.dateLabel text]isEqualToString:@"date"] && ![[self.endLabel text]isEqualToString:@"end"])
            {
                [self.warningMessage setHidden:YES];
            }

        }];
    }
    
}
-(IBAction)endTimePressed:(id)sender{
    self.startTimePicker.hidden = YES;
    self.startTimePicker.alpha = 0;
    self.meetingDatePicker.hidden = YES;
    self.meetingDatePicker.alpha = 0;

    if(self.endTimePicker.hidden){
        [UIView animateWithDuration:1 animations:^{
            self.endTimePicker.hidden = NO;
            
            self.endTimePicker.alpha = 1;
        } completion:^(BOOL finished) {
            
        }];
    } else {
        [UIView animateWithDuration:1 animations:^{
            self.endTimePicker.alpha = 0;
        } completion:^(BOOL finished) {
            self.endTimePicker.hidden = YES;
            NSDateFormatter * df = [[NSDateFormatter alloc]init];
            [df setDateFormat:@"h:mm a"];
            [self.endLabel setText:[df stringFromDate:[self.endTimePicker date]]];
            if(![[self.startLabel text]isEqualToString:@"start"] && ![[self.dateLabel text]isEqualToString:@"date"])
            {
                [self.warningMessage setHidden:YES];
            }

        }];
    }
    
}
- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender
{
    if([[self.dateLabel text]isEqualToString:@"date"] || [[self.startLabel text]isEqualToString:@"start"] || [[self.endLabel text]isEqualToString:@"end"])
    {
        [self.warningMessage setHidden:NO];
        return NO;
    }else{
        [self.warningMessage setHidden:YES];
        return YES;
    }
}

-(IBAction)datePressed:(id)sender{
    self.startTimePicker.hidden = YES;
    self.startTimePicker.alpha = 0;
    self.endTimePicker.hidden = YES;
    self.endTimePicker.alpha = 0;

    if(self.meetingDatePicker.hidden){
        [UIView animateWithDuration:1 animations:^{
            self.meetingDatePicker.hidden = NO;
            
            self.meetingDatePicker.alpha = 1;
        } completion:^(BOOL finished) {
            
        }];
    } else {
        [UIView animateWithDuration:1 animations:^{
            self.meetingDatePicker.alpha = 0;
        } completion:^(BOOL finished) {
            self.meetingDatePicker.hidden = YES;
            NSDateFormatter * df = [[NSDateFormatter alloc]init];
            [df setDateFormat:@"MMMM dd, yyyy"];
            [self.dateLabel setText:[df stringFromDate:[self.meetingDatePicker date]]];
            
            if(![[self.startLabel text]isEqualToString:@"start"] && ![[self.endLabel text]isEqualToString:@"end"])
               {
                   [self.warningMessage setHidden:YES];
               }
        }];
    }
    
}


@end
