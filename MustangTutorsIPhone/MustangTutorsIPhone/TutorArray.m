//
//  TutorArray.m
//  MustangTutorsIPhone
//
//  Created by Tyler JACKSON on 4/21/14.
//  Copyright (c) 2014 Tyler JACKSON. All rights reserved.
//

#import "TutorArray.h"
#import "Tutor.h"

@implementation TutorArray


-(instancetype)initWithTutorArray:(NSMutableArray *)tutorArray
{
    self = [super init];
    if(self)
    {
        self.tutors = [[NSMutableArray alloc]init];
        for(int i=0;i<[tutorArray count];i++)
        {
            Tutor * tempTutor = [[Tutor alloc]initWithDictionaryForSearch:[tutorArray objectAtIndex:i]];
            [self.tutors addObject:tempTutor];
        }
        _numTutors = [tutorArray count];
    }
    return self;
}
@end
